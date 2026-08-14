import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import HERO_IMAGE from "@/assets/images/hero/LoginCover.webp";

const PendingApproval = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check if user is already approved - separate effect for redirect
  useEffect(() => {
    if (user?.role === 'student' && user?.status === 'active') {
      // If user is active, redirect to student dashboard
      navigate('/student', { replace: true });
    }
  }, [user?.status, navigate]);

  // Set up polling - runs only once on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    };

    // Only set up polling if user is pending
    if (user?.role === 'student' && user?.status === 'pending') {
      // Set up polling to check every 30 seconds
      intervalRef.current = setInterval(checkStatus, 30000); // 30 seconds
    }

    // Cleanup interval on unmount or when user status changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array - runs only once on mount

  return (
    <>
      <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div
          className="absolute inset-0 bg-cover bg-[center_100%] bg-no-repeat opacity-20 bg-fixed justify-center items-center"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="relative bg-primary/10 rounded-full p-6">
                    <Clock className="w-16 h-16 text-primary" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-2">
                Conta pendente para aprovação!
              </CardTitle>
              <CardDescription className="text-lg">
                Sua conta está em análise com o administrador.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <UserCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Aguardando aprovação
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Consulte o seus senseis para realizar a ativação da sua conta na plataforma.
                      Assim que sua conta for aprovada, você terá acesso completo aos materiais de treinamento.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  O que acontece agora?
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Sua conta está criada, mas em análise</p>
                      <p className="text-sm text-muted-foreground">
                        Seus dados estão registrados no sistema
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Aguardando aprovação do administrador</p>
                      <p className="text-sm text-muted-foreground">
                        Um administrador irá revisar e ativar sua conta
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Acesso liberado após aprovação</p>
                      <p className="text-sm text-muted-foreground">
                        Você receberá acesso completo à plataforma
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 hover:bg-primary-foreground hover:text-primary hover:border-primary hover:shadow-primary"
                  onClick={() => {
                    refreshUser();
                  }}
                >
                  Verificar status
                </Button>
                <Link to="/" className="flex-1">
                  <Button variant="default" className="w-full">
                    Voltar ao início
                  </Button>
                </Link>
              </div>

              {user?.name && (
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Cadastrado como: <span className="font-semibold text-foreground">{user.name}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      <AnimatedDivider />
    </>
  );
};

export default PendingApproval;
