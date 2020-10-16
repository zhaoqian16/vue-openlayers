<%@ WebHandler Language="C#" Class="RegDataHandler" %>

using System;
using System.Web;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Collections;
public class RegDataHandler : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        //POST请求的参数获取
        string type = context.Request.Form["type"];
        string tableName = context.Request.Form["table"];
        string resulte = "";
        try
        {
            //建立连接对象
            SqlConnection conn = new SqlConnection();
            string dbName = "statisticalChart";
            string p_strUser = "sa";
            string p_strPWD = "guest";
            //string ConnectionString = String.Format("Data Source={0};Initial Catalog={1};User ID={2};PWD={3}", "(local)", dbName, p_strUser, p_strPWD);
            string ConnectionString = String.Format("Data Source={0};Initial Catalog={1};User ID={2};PWD={3}", "localhost", dbName, p_strUser, p_strPWD);            
            conn.ConnectionString = ConnectionString;//连接数据库
            conn.Open();//打开数据库
            Message.box('conn')
            if (type == "select")
            {
                string sql = string.Format("SELECT * FROM {0}", tableName);//选择查询
                SqlCommand cmd = new SqlCommand(sql, conn); //定义一个sql操作命令对象     
                SqlDataReader Reader = cmd.ExecuteReader(); //执行语句  
                                                            //遍历读取查询结果 
                while (Reader.Read())
                {
                    string id = Reader["ID"].ToString().Trim();
                    string name = Reader["省名"].ToString();
                    string Geometry = Reader["Geometry"].ToString();
                    string GDP_2015 = Reader["GDP_2015"].ToString();
                    string GDP_2016 = Reader["GDP_2016"].ToString();
                    string GDP_2017 = Reader["GDP_2017"].ToString();
                    resulte += string.Format("{{\"ID\":\"{0}\",\"name\":\"{1}\",\"Geometry\":\"{2}\",\"GDP_2015\":\"{3}\",\"GDP_2016\":\"{4}\",\"GDP_2017\":\"{5}\"}}", id, name, Geometry, GDP_2015, GDP_2016, GDP_2017) + ","; //将查询结果拼接成json字符串
                }
                resulte = "[" + resulte.Remove(resulte.Length - 1, 1) + "]";
                cmd = null;
            }
            else if (type == "insert")
            {
                string geo = context.Request.Form["geo"];
                string att = context.Request.Form["att"];
                string sql = string.Format("INSERT into {0} values('{1}','{2}',{3},{4},{5},'{6}')", tableName, att.Split(',')[0], att.Split(',')[1], Convert.ToDecimal(att.Split(',')[2]), Convert.ToDecimal(att.Split(',')[3]), Convert.ToDecimal(att.Split(',')[4]), geo);//插入查询
                SqlCommand cmd = new SqlCommand(sql, conn); //定义一个sql操作命令对象 
                if (cmd.ExecuteNonQuery() == 1)
                {
                    resulte = "添加成功！";
                }
            }
            else if (type == "delete")
            {
                string id = context.Request.Form["fID"];
                string sql = string.Format("DELETE from {0} where ID='{1}'", tableName, id);//删除查询
                SqlCommand cmd = new SqlCommand(sql, conn); //定义一个sql操作命令对象 
                if (cmd.ExecuteNonQuery() == 1)
                {
                    resulte = "删除成功！";
                }

            }
            conn.Close(); //关闭连接            
            conn.Dispose(); //释放对象 
        }
        catch (Exception ex)
        {
            throw ex;//抛出异常
        }
        //返回结果到前台
        context.Response.ContentType = "text/plain";
        context.Response.Write(resulte != "" ? resulte : "[{}]");
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}