/**
 @typedef PuppeteerTraceEvent
 @type {object}
 @property {number} pid - The process ID for the process that output this event.
 @property {number} tid - The thread ID for the thread that output this event.
 @property {number} ts - The tracing clock timestamp of the event. The timestamps are provided at microsecond granularity.
 @property {string} ph - The event type. This is a single character which changes depending on the type of event being output. The valid values are listed in the table below. We will discuss each phase type below.
 @property {string} cat - The event categories. This is a comma separated list of categories for the event. The categories can be used to hide events in the Trace Viewer UI.
 @property {string} name - The name of the event, as displayed in Trace Viewer.
 @property {object} args - Any arguments provided for the event. Some of the event types have required argument fields, otherwise, you can put any information you wish in here. The arguments are displayed in Trace Viewer when you view an event in the analysis section.
 @property {number} [dur] - Optional. Specify the tracing clock duration of complete events in microseconds.
 @property {number} [tdur] - Optional. Specifies the thread clock duration of complete events in microseconds.
 @property {number} [tts] - Optional. The thread clock timestamp of the event. The timestamps are provided at microsecond granularity.

 @link https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit#heading=h.uxpopqvbjezh
 */

/**
 @typedef PuppeteerTraceEventWithRelativeTime
 @type {object}
 @property {number} timeFromStart - specifies time since the first frame was taken (timeFromStart for first frame is 0)
 */

/**
 *
 * @param {Array.<PuppeteerTraceEvent>} traceEvents - array of trace data representation that is processed by the Trace Viewer application
 * @returns {Array.<PuppeteerTraceEvent & PuppeteerTraceEventWithRelativeTime>}
 */
function convertSnapshotTimeToRelative(traceEvents) {
  return traceEvents.map((traceEvent, index, allTraceEvents) => {
    let timeFromStart = 0;

    if (index !== 0) {
      timeFromStart = traceEvent.ts - allTraceEvents[0].ts;
    }

    return {
      ...traceEvent,
      timeFromStart,
    }
  });
}

module.exports = convertSnapshotTimeToRelative;
