using System;

namespace AureliaDemo.Services
{
    using System.Text;

    public class Logger
    {
        private string _className;

        /// <summary>
        /// Create a new Logger instance
        /// </summary>
        /// <param name="className"></param>
        public Logger(string className)
        {
            this._className = className;
        }

        #region Logging Methods
        public void Trace(string fmt, params string[] list)
        {
            Log("TRACE", fmt, list);
        }

        public void Debug(string fmt, params string[] list)
        {
            Log("DEBUG", fmt, list);
        }

        public void Info(string fmt, params string[] list)
        {
            Log("INFO", fmt, list);
        }

        public void Error(string fmt, params string[] list)
        {
            Log("ERROR", fmt, list);
        }

        public void Critical(string fmt, params string[] list)
        {
            Log("CRITICAL", fmt, list);
        }

        public void Enter(string method, params string[] list)
        {
            var m = new StringBuilder(String.Format("{0}(", method));
            for (int i = 0; i < list.Length; i++)
            {
                if (i != 0) m.Append(",");
                m.Append("\"" + list[i] + "\"");
            }
            m.Append(")");
            Log("ENTER", m.ToString());
        }

        public void Leave(string method)
        {
            Log("LEAVE", method);
        }
        #endregion

        private void Log(string lvl, string fmt, params string[] list)
        {
            string h = String.Format("### {0} [{1}]:", _className, lvl);
            string m = String.Format(fmt, list);
            System.Diagnostics.Debug.WriteLine(h + " " + m);
        }

        public static Logger GetLogger(string className)
        {
            return new Logger(className);
        }
    }
}
