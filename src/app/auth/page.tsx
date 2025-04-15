"use client";
import React, { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import api, { endpoints } from "@/lib/helpers/api";

const LoginPage = () => {
  const [step, setStep] = useState<
    "checkUser" | "validationType" | "otp" | "password"
  >("checkUser");
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [validationType, setValidationType] = useState<"passkey" | "password">(
    "passkey"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const onSelectValidationType = (type: "passkey" | "password") => {
    setValidationType(type);
  };

  const onVerifyOtp = async () => {
    try {
      const {data} = await api.post(endpoints.auth.verifyOtp, { email, code: otp });

      if (data) {
        toast.success("OTP verificado correctamente");

        if (authType === 'register') {
          setStep("validationType");
          return;
        }

        if (validationType === 'passkey') {
          // Step 1: Call the backend to get the challenge for passkey authentication
          const {data: startAuthResult} = await api.post(endpoints.auth.startAuthentication, {
            email,
            platform: "WEB",
          });

          const { challenge, authenticationOptions } = startAuthResult;
          const payload = {
            ...authenticationOptions,
            challenge,
          };
          const result = await startAuthentication(payload);
          // Step 2: Call the backend to complete the authentication
          const {data: completeAuthResult} = await api.post(endpoints.auth.completeAuthentication, {
            email,
            authenticationResponse: result,
            challenge,
          });
          console.log("Complete authentication result:", completeAuthResult);
          toast.success("Autenticación correcta");
          sessionStorage.setItem("access_token", completeAuthResult.user.access_token);
          sessionStorage.setItem("user", JSON.stringify(completeAuthResult.user));
          window.location.href = "/dashboard";
        } else {
          setStep("password");
        }

      } else {
        toast.error(data.message || "Error al verificar el OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Ocurrió un error inesperado");
    }
  }

  const requestOtp = async () => {
    try {
      const {data} = await api.post(endpoints.auth.requestOtp, { email });
      if (data) {
        toast.success("Código enviado a tu correo electrónico");
      } else {
        toast.error("Error al enviar el código");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Ocurrió un error inesperado");
    }
  };

  const onStartAuthenticationWithValidationType = async () => {
    if (authType === 'register') {
      setStep("password");
      return;
    }
    if (validationType === "passkey") {
      // Step 1: Call the backend to get the challenge for passkey authentication
      const {data: authRequest} = await api.post(endpoints.auth.startAuthentication, {
        email,
        platform: "WEB",
      });

      const { challenge, authenticationOptions, registrationOptions, action, } = authRequest;

      if (action === "LOGIN") {
        const payload = {
          ...authenticationOptions,
          challenge,
        };
        console.log("Payload for authentication:", payload);
        const result = await startAuthentication(payload);

        const {data: completeAuthenticationResult} = await api.post(endpoints.auth.completeAuthentication, {
          email,
          authenticationResponse: result,
          challenge,
        })

        toast.success("Autenticación correcta");
        // Example: Save the token and redirect the user
        sessionStorage.setItem("access_token", completeAuthenticationResult.user.access_token);
        sessionStorage.setItem("user", JSON.stringify(completeAuthenticationResult.user));
        window.location.href = "/dashboard";
      } else {
        const payload = {
          ...registrationOptions,
          challenge,
        };
        const result = await startRegistration(payload);

        const { data: completeRegistrationResult } = await api.post(endpoints.auth.completeRegistration, {
          email,
          registrationResponse: result,
          platform: "WEB",
          challenge,
        });

        toast.success("Autenticación correcta");
        // Example: Save the token and redirect the user
        sessionStorage.setItem("access_token", completeRegistrationResult.user.access_token);
        sessionStorage.setItem("user", JSON.stringify(completeRegistrationResult.user));
        window.location.href = "/dashboard";
      }
    } else {
      const {data} = await api.post(endpoints.auth.requestOtp, {
        email,
      });

      if (data) {
        setStep("otp");
        toast.success("Código enviado a tu correo electrónico");
      }
    }
  };

  const handleLogin = async () => {
    try {
     if (authType === 'register') {
      const {data: registerResult} = await api.post(endpoints.auth.register, { email, password });
        toast.success("Registro exitoso");
        sessionStorage.setItem("access_token", registerResult.user.access_token);
        sessionStorage.setItem("user", JSON.stringify(registerResult.user));
        window.location.href = "/dashboard";
      return;
     } else {
      const {data: loginResult} = await api.post(endpoints.auth.login, { email, password });
        toast.success("Inicio de sesión exitoso");
        sessionStorage.setItem("access_token", loginResult.user.access_token);
        sessionStorage.setItem("user", JSON.stringify(loginResult.user));
        window.location.href = "/dashboard";
     }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Ocurrió un error inesperado");
    }
  }


  const warmUpAuthentication = async () => {
      try {
        const {data} = await api.post(endpoints.auth.checkUserByEmail, { email });
        if (!data.userFound) {
          setAuthType('register');
          toast.info(data.message);
          setStep("otp");
        } else {
          toast.success(data.message);
          setStep("validationType");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        toast.error("Ocurrió un error inesperado");
      }
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {step === "otp"
            ? "Verifica tu OTP"
            : step === "checkUser"
            ? "Bienvenido a Finanzas Inteligentes"
            : step === 'validationType'
            ? "Como quieres iniciar sesión?"
            : "Iniciar Sesión"}
        </h2>
        <p className="text-center text-gray-600">
          {step === "otp"
            ? "Ingresa el código OTP enviado a tu correo electrónico."
            : step === "checkUser"
            ? "Ingresa tu correo electrónico para continuar."
            : step === "validationType"
            ? "Selecciona el método de validación para iniciar sesión."
            : "Ingresa tu contraseña para continuar."}
        </p>
        {step === "checkUser" && (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <Button onClick={warmUpAuthentication} className="w-full mt-4">
              Iniciar Sesión
            </Button>

            <div className="mt-4 text-center">
           <p className="text-sm text-gray-600">
             ¿No tienes cuenta?{" "}
             <a href="/register" className="text-blue-500 hover:underline">
               Regístrate aquí
             </a>
           </p>
         </div>
          <div className="space-y-2 mt-4">
            <Button variant="outline" className="w-full" disabled>
              Iniciar sesión con Google
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Iniciar sesión con Apple
            </Button>
          </div>
          </div>
        )}
        {step === "otp" && (
          <div>
            <div className="flex items-center justify-center mt-1">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot inputMode="numeric" index={0} />
                  <InputOTPSlot inputMode="numeric" index={1} />
                  <InputOTPSlot inputMode="numeric" index={2} />
                  <InputOTPSlot inputMode="numeric" index={3} />
                  <InputOTPSlot inputMode="numeric" index={4} />
                  <InputOTPSlot inputMode="numeric" index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Si no recibiste el código, verifica tu correo electrónico o{" "}
                <a
                  className="text-blue-500 underline cursor-pointer"
                  onClick={requestOtp}
                >
                  vuelve a enviarlo
                </a>
                .
              </p>
            </div>
            <Button onClick={onVerifyOtp} className="w-full my-4">
              Verificar OTP
            </Button>
          </div>
        )}
        {step === "validationType" && (
          <Fragment>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectValidationType("passkey")}
                className={`w-full px-4 py-2 text-sm font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  validationType === "passkey"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Huella Digital
              </button>
              <button
                onClick={() => onSelectValidationType("password")}
                className={`w-full px-4 py-2 text-sm font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  validationType === "password"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Contraseña
              </button>
            </div>
            <Button
              onClick={onStartAuthenticationWithValidationType}
              className="w-full my-4"
            >
              Continuar
            </Button>
          </Fragment>
        )}
        {
          step === "password" && (
            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
               <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Si olvidaste tu contraseña,{" "}
                <a href="/forgot-password" className="text-blue-500 hover:underline">
                  restablecer aquí
                </a>
                .
              </p>
            </div>
              <Button onClick={handleLogin} className="w-full mt-4">
                Iniciar Sesión
              </Button>
            </div>
          )
        }

        {
          step !== 'checkUser' &&
          <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white border-gray-300" onClick={() => {
            setStep("checkUser");
            setEmail("");
            setPassword("");
            setOtp("");
            setValidationType("passkey");
            setAuthType("login");
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2 inline-block"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 12h3v8h6v-6h4v6h6v-8h3L12 2z" />

            </svg>
            <span className="inline-block">Volver</span>
          </button>
        }

      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
