const locals = {
    index: {
        pageName: 'index',
        title: 'valentin orrit',
        description: 'personal website with portfolio and simple blog, created with Nodejs, Express & MongoDB'
    },
    portfolio: {
        pageName: 'portfolio',
        title: 'portfolio - valentin orrit',
        description: 'view my portfolio'
    },
    logbook: {
        pageName: 'logbook',
        title: 'logbook - valentin orrit',
        description: 'logbook of my journey to web development'
    },
    contact: {
        pageName: 'contact',
        title: 'contact - valentin orrit',
        description: 'hit me up!'
    },
    adminLogin: {
        pageName: 'admin-login',
        title: 'admin - valentin orrit',
        description: 'the admin login page'
    },
    adminDashboard: {
        pageName: 'admind-dashboard',
        title: 'dashboard - valentin orrit',
        description: 'the admin dashboard page'
    },
    adminAddLog: {
        pageName: 'admin-add-log',
        title: 'add log - valentin orrit',
        description: 'add a new log'
    },
    emailSent: {
        pageName: 'email-sent',
        title: 'email sent - valentin orrit',
        description: 'thank your for you message'
    },
    liveProjectManager: {
        pageName: 'live-project-manager',
        title: 'live project manager - valentin orrit',
        description: 'CLI App which finds ableton live projects in a given directory, extract the pertinent data and store it in a JSON database.'
    },
    hotefinder: {
        pageName: 'hotefinder',
        title: 'hotefinder - valentin orrit',
        description: 'Platform that connects concierges and property owners for managing short-term rentals. Allows the creation and updating of tasks to facilitate the concierge\'s work and automatically keep the owner informed.'
    },
    doubleGalaxy: {
        pageName: 'threejs-double-galaxy',
        title: 'threejs double galaxy - valentin orrit',
        description: '3D representation of galaxies in Three.js, adapted from an exercise in the Three.js Journey course by Bruno Simon.'
    },

    // Get individual locals for each log entry
    getLogLocals: function(data) {
        return {
            pageName: 'log',
            title: `${data.title} - valentin orrit`,
            description: data.body.substring(0, 160) + '...'
        };
    }    
};

module.exports = locals
