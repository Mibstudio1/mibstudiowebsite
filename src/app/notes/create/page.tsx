"use client";

import CreateNoteForm from "@/components/createNote/CreateNoteForm";

const CreateNote = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-0 md:p-4">
        <div className="bg-gradient-to-r from-gray-800 to-black rounded-t-2xl px-6 py-4 text-xl font-bold text-white shadow-lg">
          <h2>Meeting Note</h2>
          <h2 className="text-sm opacity-80">สรุปรายงานการประชุม</h2>
        </div>

        <CreateNoteForm />
      </div>
    </div>
  );
};

export default CreateNote;
