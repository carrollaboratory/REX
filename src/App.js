import { AppFHIR } from "./components/AppFHIR";
import AuthProvider from "./components/AuthContext/AuthProvider";
import { WorkerProvider } from "./components/WorkerContext/WorkerProvider";

export const App = () => {
  return (
    <WorkerProvider>
      <AuthProvider>
        <AppFHIR />
      </AuthProvider>
    </WorkerProvider>
  );
};
