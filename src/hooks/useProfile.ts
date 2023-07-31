import { useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";

function useProfile() {
  const profileUser = useAppSelector((state: RootState) => state.rootReducer.profile);
  return profileUser;
}

export default useProfile;
