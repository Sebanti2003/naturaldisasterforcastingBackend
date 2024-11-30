export const validatetheformatepasssword=(pass)=>{
    const passwordregex=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if(!passwordregex.test(pass)){
        return true;
    }
    return true;
}