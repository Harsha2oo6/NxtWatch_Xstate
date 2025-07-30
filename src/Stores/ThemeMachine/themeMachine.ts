
import { assign, createMachine} from "xstate";

const ThemeMachine = createMachine({
  id: "themeMachine",
  initial: 'initialState',
  context:{
    currentTheme:localStorage.getItem("theme") || "light"
  },

  states: {
    initialState:{
        on:{
            toggle:{
                actions:[
                    assign(({context})=>{
                        let themeToApply=context.currentTheme==='dark'?'light':'dark'
                        localStorage.setItem("theme",themeToApply);
                        return {
                            currentTheme:themeToApply
                        }
                    })
                ]
            }
        }
    },
  },
});

export default ThemeMachine
