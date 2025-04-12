'use client';
import React, { useState } from 'react';
import { Button } from "@/lib/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/lib/components/ui/input-otp';

const LoginPage = () => {
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

    const onCodeSendForRegisterPassKey = async () => {
        try {
            const response = await fetch('/api/auth/validateEmailForRegister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code: otp }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
            toast.success('Código enviado a tu correo electrónico');
            
             // Step 2: Use the SimpleWebAuthn `startAuthentication` API
            const registrationResult = await startRegistration(data);

            console.log('RegistrationResult result:', registrationResult);

            if (registrationResult) {
                // Step 3: Send the authentication result back to the backend to complete authentication
                const completeResponse = await fetch('/api/auth/complete-authentication', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email,
                    authenticationResponse: registrationResult,
                    challenge: data.challenge,
                  }),
                });
      
                const completeData = await completeResponse.json();
      
                console.log('Complete authentication data:', completeData);
      
                if (completeResponse.ok) {
                  toast.success('Autenticación correcta');
                  // Example: Save the token and redirect the user
                  localStorage.setItem('access_token', completeData.user.access_token);
                  window.location.href = '/dashboard';
                } else {
                  toast.error('Error al autenticar');
                }
              }
            } else {
            toast.error(data.message || 'Error al enviar el código');
            }
        } catch (error) {
            console.error('Error sending code:', error);
            toast.error('Ocurrió un error inesperado');
        }
    }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isOtpMode) {
        onCodeSendForRegisterPassKey();
        return;
    }
    
    // Handle email submission
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const emailInput = formData.get('email') as string;
    setEmail(emailInput);

    try {
      const response = await fetch('/api/auth/loginOrRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.error) {
          toast.info(data.message || 'Por favor, verifica tu correo electrónico');
          setIsOtpMode(true); // Switch to OTP mode
          return;
        }

        // Step 2: Use the SimpleWebAuthn `startAuthentication` API
        const authenticationResult = await startAuthentication(data);

        console.log('Authentication result:', authenticationResult);

        if (authenticationResult) {
          // Step 3: Send the authentication result back to the backend to complete authentication
          const completeResponse = await fetch('/api/auth/complete-authentication', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: emailInput,
              authenticationResponse: authenticationResult,
              challenge: data.challenge,
            }),
          });

          const completeData = await completeResponse.json();

          console.log('Complete authentication data:', completeData);

          if (completeResponse.ok) {
            toast.success('Autenticación correcta');
            // Example: Save the token and redirect the user
            localStorage.setItem('access_token', completeData.user.access_token);
            window.location.href = '/dashboard';
          } else {
            toast.error('Error al autenticar');
          }
        }
      } else {
        toast.error('Error al obtener los datos de autenticación');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      toast.error('Ocurrió un error inesperado');
    }
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gray-100"
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
          {isOtpMode ? 'Verifica tu OTP' : 'Bienvenido a Finanzas Inteligentes'}
        </h2>
        <p className="text-center text-gray-600">
          {isOtpMode
            ? 'Ingresa el código OTP enviado a tu correo electrónico.'
            : 'Administra tus finanzas de manera fácil y eficiente.'}
        </p>
        <form className="space-y-4" onSubmit={handleLogin}>
          {!isOtpMode ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Código OTP
              </label>
              <div className="flex items-center justify-center mt-1">
              <InputOTP 
                maxLength={6} 
                value={otp}
                onChange={(value) => setOtp(value)}>
                    <InputOTPGroup>
                        <InputOTPSlot inputMode='numeric' index={0} />
                        <InputOTPSlot inputMode='numeric' index={1} />
                        <InputOTPSlot inputMode='numeric' index={2} />
                        <InputOTPSlot inputMode='numeric' index={3} />
                        <InputOTPSlot inputMode='numeric' index={4} />
                        <InputOTPSlot inputMode='numeric' index={5} />
                    </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          )}
          <Button type="submit" className="w-full">
            {isOtpMode ? 'Verificar OTP' : 'Iniciar Sesión'}
          </Button>
        </form>
        {!isOtpMode && (
          <div className="space-y-2">
            <Button variant="outline" className="w-full" disabled>
              Iniciar sesión con Google
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Iniciar sesión con Apple
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;