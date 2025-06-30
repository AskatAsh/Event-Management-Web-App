import { Suspense } from "react";
import { RouterProvider } from "react-router";
import AuthProvider from "./contexts/AuthProvider";
import router from "./routes/router";

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </Suspense>
    </>
  );
}

export default App;
