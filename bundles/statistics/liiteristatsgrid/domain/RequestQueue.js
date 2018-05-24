
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.RequestQueue',
    function () {
        this._queue = [];
        this._id = null;
        this._stop = false;
        this._lastNumberOfJobs = 0;
    }, {
        
        start: function () {
            var me = this;
            me._id = window.setTimeout(function() {
                me.run();
            }, 500);
        },
        stop: function () {
            var me = this;
            this._stop = true;
            window.clearTimeout(me._id);
        },
        pushJob : function(cb) {
            this._queue.push(cb);
        },
        run: function () {
            var me = this;
            if (me._stop)
                return;

            var len = me._queue.length;

            if (len > 0) {

                if (me._lastNumberOfJobs == len) {
                    var job = me._queue[len - 1];
                    console.log("Invoke " + (len - 1) + " job");
                    job();

                    me._queue = me._queue.slice(len);
                    me._lastNumberOfJobs = 0;
                } else {
                    me._lastNumberOfJobs = len;
                }                
            }
            
            if (!me._stop)
                me._id = window.setTimeout(function () {
                    me.run();
                }, 500);
        }
    });
