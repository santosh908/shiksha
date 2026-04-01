import create from 'zustand';
import  {RegistrationRequest}   from '../Components/organisms/Dashboard/AsheryLeader/DevoteeRegistrationList.type';


interface DevoteeRegistrationStore {
    registrationRequests: RegistrationRequest[];
    setRegistrationRequests: (data: RegistrationRequest[]) => void;
  }
  
  export const useDevoteeRegistrationStore = create<DevoteeRegistrationStore>((set) => ({
    registrationRequests: [],
    setRegistrationRequests: (data) => set(() => ({ registrationRequests: data })),
  }));