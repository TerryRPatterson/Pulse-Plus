let sortByTime = (messages) => {
    messages.sort((a,b) => {
        if (a.ts < b.ts){
            return -1;
        }
        else if (a.ts > b.ts){
            return 1;
        }
        else if (a.ts === b.ts){
            return 0;
        }
        else {
            throw new Error("A sorting error has occured");
        }
    });
};

export default sortByTime;
