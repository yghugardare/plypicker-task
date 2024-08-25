const fetchUser = () => {
    const storedUser = JSON.parse(localStorage.getItem("logedin-user") as string);
    if(storedUser){
        return storedUser;
    }
    return null;
}
export default fetchUser; 