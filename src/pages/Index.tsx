import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="mb-2 text-4xl font-extrabold text-foreground">
            Vibee<span className="text-gradient">flow</span>
          </h1>
          <p className="text-muted-foreground">
            Your vibe-coded SaaS, tested like a real user would.
          </p>
        </div>
        <button
          onClick={() => navigate("/prd")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          <FileText className="w-4 h-4" />
          Ver PRD Completo
        </button>
      </div>
    </div>
  );
};

export default Index;
