const locals = {
    index: {
        title: 'valentin orrit',
        description: 'personal website with portfolio and simple blog, created with Nodejs, Express & MongoDB'
    },
    portfolio: {
        title: 'portfolio - valentin orrit',
        description: 'view my portfolio'
    },
    logbook: {
        title: 'logbook - valentin orrit',
        description: 'logbook of my journey to web development'
    },
    contact: {
        title: 'contact - valentin orrit',
        description: 'hit me up!'
    },
    adminLogin: {
        title: 'admin - valentin orrit',
        description: 'the admin login page'
    },
    adminDashboard: {
        title: 'dashboard - valentin orrit',
        description: 'the admin dashboard page'
    },
    adminAddLog: {
        title: 'add log - valentin orrit',
        description: 'add a new log'
    },

    // Get individual locals for each log entry
    getLogLocals: function(data) {
        return {
            title: `${data.title} - valentin orrit`,
            description: data.body.substring(0, 160) + '...'
        };
    }    
};

module.exports = locals
