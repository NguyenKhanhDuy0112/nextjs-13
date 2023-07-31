import { useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";

function useAuth() {
  const auth = useAppSelector((state: RootState) => state.rootReducer.auth);
  return auth;
}

export default useAuth;
