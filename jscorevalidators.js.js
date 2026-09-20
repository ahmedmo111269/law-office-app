LawOfficeApp.Core.Validators = {
    validateClient(data) {
        if (!data.fullName || data.fullName.trim() === "") {
            return { valid: false, message: "اسم العميل مطلوب صراحةً." };
        }
        return { valid: true };
    }
};