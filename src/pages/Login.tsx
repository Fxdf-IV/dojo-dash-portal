import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logo from "@/assets/logo.webp";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { locationsService, authService } from "@/services";
import type { Location } from "@/types";
import HERO_IMAGE from "@/assets/images/hero/LoginCover.webp";
import { AnimatedDivider } from "@/components/AnimatedDivider";

const Login = () => {
  const { toast } = useToast();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: ""
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoadingLocations(true);
        const data = await locationsService.getAll();
        setLocations(data);
      } catch (error) {
        console.error("Erro ao carregar locais:", error);
        setLocations([]);
      } finally {
        setLoadingLocations(false);
      }
    };

    loadLocations();
  }, []);

  const locationNames = locations.map((location) => location.name).filter(Boolean);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user } = await login(loginData.email, loginData.password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para sua área..."
      });
      setTimeout(() => {
        // Check if student is pending approval
        if (user?.role === 'student' && user?.status === 'pending') {
          navigate("/pending-approval");
        } else if (user?.role === 'student') {
          navigate("/student");
        } else if (user?.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    if (!signupData.location) {
      toast({
        title: "Erro no cadastro",
        description: "Por favor, selecione onde você treina.",
        variant: "destructive"
      });
      return;
    }

    try {
      await register(signupData.name, signupData.email, signupData.password, signupData.location);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Aguarde aprovação do administrador."
      });
      setTimeout(() => {
        navigate("/pending-approval");
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível realizar o cadastro. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  return <><div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-hero" />
    <div
      className="absolute inset-0 bg-cover bg-[center_100%] bg-no-repeat opacity-20 bg-fixed justify-center items-center"
      style={{ backgroundImage: `url('${HERO_IMAGE}')` }} />

    <div className="container mx-auto px-4 py-12 relative z-10">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img src={logo} alt="Alessandro Karatê e Kobudo" className="h-20 w-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary-foreground mb-4">Área do Aluno</h1>
          <p className="text-primary-foreground mb-4">Acesse sua conta ou cadastre-se</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="hover:text-primary" value="login">Login</TabsTrigger>
            <TabsTrigger className="hover:text-primary" value="signup">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Entrar na Conta</CardTitle>
                <CardDescription>Digite suas credenciais para acessar</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    // Backend handles email or username logic automatically
                    const { user } = await login(loginData.email, loginData.password);
                    toast({
                      title: "Login realizado com sucesso!",
                      description: "Redirecionando para sua área..."
                    });
                    setTimeout(() => {
                      // Check if student is pending approval
                      if (user?.role === 'student' && user?.status === 'pending') {
                        navigate("/pending-approval");
                      } else if (user?.role === 'student') {
                        navigate("/student");
                      } else if (user?.role === 'admin') {
                        navigate("/admin");
                      } else {
                        navigate("/");
                      }
                    }, 1000);
                  } catch (error) {
                    toast({
                      title: "Erro no login",
                      description: "Credenciais inválidas. Tente novamente.",
                      variant: "destructive"
                    });
                  }
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email ou Usuário</Label>
                    <Input id="login-email" type="text" placeholder="seu@email.com ou seu.usuario" value={loginData.email} onChange={e => setLoginData({
                      ...loginData,
                      email: e.target.value
                    })} required />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Senha</Label>
                    <Input id="login-password" type="password" placeholder="••••••••" value={loginData.password} onChange={e => setLoginData({
                      ...loginData,
                      password: e.target.value
                    })} required />
                  </div>
                  <Button type="submit" className="w-full shadow-glow">
                    Entrar
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Esqueceu sua senha?{" "}
                    <span
                      className="text-primary cursor-pointer hover:underline"
                      onClick={async () => {
                        if (!loginData.email) {
                          toast({
                            title: "Campo obrigatório",
                            description: "Por favor, insira seu email no campo de login para recupera a senha.",
                            variant: "destructive",
                          });
                          return;
                        }

                        try {
                          const response = await authService.requestPasswordReset(loginData.email);
                          if (response.success) {
                            navigate("/pending-approval");
                          } else {
                            toast({
                              title: "Email não encontrado",
                              description: "Email não cadastrado. Entre em contato com um de seus senseis.",
                              variant: "destructive",
                            });
                          }
                        } catch (error) {
                          toast({
                            title: "Erro",
                            description: "Erro ao verificar email. Tente novamente.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Recuperar senha
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Preencha os dados para solicitar seu cadastro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Nome Completo</Label>
                    <Input id="signup-name" type="text" placeholder="Seu nome completo" value={signupData.name} onChange={e => setSignupData({
                      ...signupData,
                      name: e.target.value
                    })} required />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="seu@email.com" value={signupData.email} onChange={e => setSignupData({
                      ...signupData,
                      email: e.target.value
                    })} required />
                  </div>
                  <div>
                    <Label htmlFor="signup-location">Onde você treina?</Label>
                    <Select
                      value={signupData.location}
                      onValueChange={value => setSignupData({
                        ...signupData,
                        location: value
                      })}
                      disabled={loadingLocations || locationNames.length === 0}
                    >
                      <SelectTrigger id="signup-location">
                        <SelectValue
                          placeholder={loadingLocations
                            ? "Carregando locais..."
                            : locationNames.length === 0
                              ? "Nenhum local disponível"
                              : "Selecione o local"} />
                      </SelectTrigger>
                      <SelectContent>
                        {locationNames.map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                        {signupData.location && !locationNames.includes(signupData.location) && (
                          <SelectItem value={signupData.location}>
                            {signupData.location}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input id="signup-password" type="password" placeholder="••••••••" value={signupData.password} onChange={e => setSignupData({
                      ...signupData,
                      password: e.target.value
                    })} required />
                  </div>
                  <div>
                    <Label htmlFor="signup-confirm">Confirmar Senha</Label>
                    <Input id="signup-confirm" type="password" placeholder="••••••••" value={signupData.confirmPassword} onChange={e => setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value
                    })} required />
                  </div>
                  <Button type="submit" className="w-full shadow-glow">
                    Solicitar Cadastro
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Seu cadastro será analisado pela administração e você receberá uma confirmação por email.
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
  <AnimatedDivider />
  </>
};
export default Login;
