import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="fixed inset-0 bg-white flex items-center justify-center"
      style={{ backgroundColor: "white", margin: 0, padding: 0 }}
    >
      <div className="flex justify-center w-[800px] h-screen md:h-[650px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="hidden md:w-1/2 bg-gradient-to-br from-gray-900 to-black md:flex flex-col justify-center items-center text-center relative border-r border-gray-300">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 space-y-4 ml-4">
            <div className="my-4 -ml-2">
              <img
                src="/logo.png"
                alt="MIB Studio Logo"
                width="300"
                height="300"
                className="object-contain max-w-full h-auto"
                style={{ maxWidth: "300px", maxHeight: "300px" }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <LoginForm />
      </div>
    </div>
  );
}
