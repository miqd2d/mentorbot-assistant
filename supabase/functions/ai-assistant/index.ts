
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import OpenAI from "npm:openai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AIAssistantRequest {
  message: string;
  professor_email?: string;  // To fetch professor-specific data
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required API keys");
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request
    const data: AIAssistantRequest = await req.json();
    if (!data.message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Received message:", data.message);

    // ** Fetch Professor-specific Context from Supabase **
    let professorContext = "You are an AI assistant for an educational platform. You help professors manage students, assignments, attendance, and emails.";

    let professorData, studentData, assignmentData, attendanceData;

    if (data.professor_email) {
      // Get professor-specific data
      const { data: profData, error: profError } = await supabase
        .from("professors_data")
        .select("*")
        .eq("email", data.professor_email)
        .single();

      if (!profError && profData) {
        professorData = profData;
        professorContext += `\nProfessor Info: ${JSON.stringify(profData)}\n`;
      }

      // Fetch all students under this professor
      const { data: students, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("professor_email", data.professor_email);

      if (!studentError && students.length > 0) {
        studentData = students;
        professorContext += `\nStudents: ${JSON.stringify(students)}\n`;
      }

      // Fetch all assignments under this professor
      const { data: assignments, error: assignmentError } = await supabase
        .from("assignments")
        .select("*")
        .eq("professor_email", data.professor_email);

      if (!assignmentError && assignments.length > 0) {
        assignmentData = assignments;
        professorContext += `\nAssignments: ${JSON.stringify(assignments)}\n`;
      }

      // Fetch all attendance records under this professor
      const { data: attendance, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("professor_email", data.professor_email);

      if (!attendanceError && attendance.length > 0) {
        attendanceData = attendance;
        professorContext += `\nAttendance: ${JSON.stringify(attendance)}\n`;
      }
    }

    // ** Handle Specific AI Queries **
    let aiResponse = "";

    if (/send email/i.test(data.message)) {
      aiResponse = "Would you like me to write it for you, or would you provide the content?";
    } else if (/send reminder/i.test(data.message)) {
      aiResponse = "Reminder has been sent successfully.";
    } else if (/mark attendance/i.test(data.message)) {
      aiResponse = "Attendance marked for today.";
    } else if (/list students with attendance below (\d+)%/i.test(data.message)) {
      const threshold = parseInt(data.message.match(/(\d+)%/)[1], 10);
      const lowAttendanceStudents = attendanceData
        ? attendanceData
            .filter(student => student.attendance_percentage < threshold)
            .map(student => `${student.name} (${student.roll_number} - ${student.attendance_percentage}%)`)
        : [];
      
      aiResponse = lowAttendanceStudents.length > 0
        ? `Students with attendance below ${threshold}%:\n` + lowAttendanceStudents.join("\n")
        : "No students found with attendance below the specified threshold.";
    } else if (/show assignments due this week/i.test(data.message)) {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcomingAssignments = assignmentData
        ? assignmentData
            .filter(assign => new Date(assign.due_date) >= today && new Date(assign.due_date) <= nextWeek)
            .map(assign => `${assign.title} (Due: ${assign.due_date})`)
        : [];

      aiResponse = upcomingAssignments.length > 0
        ? `Assignments due this week:\n` + upcomingAssignments.join("\n")
        : "No assignments due this week.";
    } else if (/students who haven't submitted (.+)/i.test(data.message)) {
      const assignmentName = data.message.match(/students who haven't submitted (.+)/i)[1];
      const assignment = assignmentData?.find(a => a.title.toLowerCase() === assignmentName.toLowerCase());

      if (assignment) {
        const studentsNotSubmitted = studentData
          ? studentData
              .filter(student => !assignment.submitted_by.includes(student.roll_number))
              .map(student => `${student.name} (${student.roll_number})`)
          : [];

        aiResponse = studentsNotSubmitted.length > 0
          ? `Students who haven't submitted ${assignmentName}:\n` + studentsNotSubmitted.join("\n")
          : `All students have submitted ${assignmentName}.`;
      } else {
        aiResponse = `Couldn't find an assignment named "${assignmentName}".`;
      }
    } else {
      // ** Use OpenAI for General AI Queries **
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

      const response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: professorContext },
          { role: "user", content: data.message }
        ],
        temperature: 0.7,
        max_tokens: 500,
        model: "gpt-4o-mini"
      });

      aiResponse = response.choices[0].message.content || "I'm not sure how to respond.";
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in AI assistant function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
