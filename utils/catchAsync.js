module.exports = func => { // accept a function and returns a function that executes func and catches any errors and pass to next
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
};