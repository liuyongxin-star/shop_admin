export default {
    state: {
        title: "",
        url: "",
    },
    mutations: {
        changeData(state, title) {
            state.title = title;
        },
    }
};
