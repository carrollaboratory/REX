import { AppFHIR } from "./components/AppFHIR";
import AuthProvider from "./components/AuthContext/AuthProvider";
import { WorkerProvider } from "./components/WorkerContext/WorkerProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const App = () => {
  return (
    <WorkerProvider>
      <AuthProvider>
        <AppFHIR />
      </AuthProvider>
    </WorkerProvider>
  );
};
