import { createMachine } from "xstate";
import ThemeMachine from "../ThemeMachine/themeMachine";
import { loginMachineConfig } from "../LoginMachine/loginMachine";
import { dashboardMachineConfig } from "../DashboardMachine/dashboardMachine";

const NxtwatchMachineConfig=createMachine({
    type:'parallel',
    states:{
        theme:{
            invoke:{
                id:'themeMachine',
                src:ThemeMachine
            }
        },
        login:{
            invoke:{
                id:'loginMachine',
                src:loginMachineConfig
            }
        },
        app:{
            invoke:{
                id:'app',
                src:dashboardMachineConfig
            }
        }
    }

})
export default NxtwatchMachineConfig