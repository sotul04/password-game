const PASSWORD = {
    currentPassword: "",
    lengthCut: 0,
    reset: function() {
        this.currentPassword = "";
        this.lengthCut = 0;
    }
}

export default PASSWORD;