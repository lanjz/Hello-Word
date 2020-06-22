var http = require("http");
function generateChunk(index, response) {
    setTimeout(() => {
        if (index === 5) {
            response.write("end");
            response.write("");
            // response.end("</body></html>");
        } else {
            response.write('</span>&lt;p&gt; chunk <span class="pl-s1"><span class="pl-pse">${</span>index<span class="pl-pse">}</span></span>&lt;/p&gt;<span class="pl-pds">');
        }
        }, index * 1000)
}


function handlerRequest(_request, response) {
response.setHeader("Content-Type", "text/html; charset=UTF-8");
response.setHeader("Transfer-Encoding", "chunked");
response.write('</span>&lt;!DOCTYPE html&gt;</span> <span class="pl-s"> &lt;html lang="en"&gt;</span> <span class="pl-s"> &lt;head&gt;</span> <span class="pl-s"> &lt;meta charset="utf-8"&gt;</span> <span class="pl-s"> &lt;title&gt;HTTP 分块传输示例&lt;/title&gt;</span> <span class="pl-s"> &lt;/head&gt;</span> <span class="pl-s"> &lt;body&gt;</span> <span class="pl-s"> &lt;h1&gt;HTTP 分块传输示例&lt;/h1&gt;</span> <span class="pl-s"> <span class="pl-pds">');


let index = 0;
while (index <= 5) {
generateChunk(index, response);
index++;
}
}


const server = http.createServer(handlerRequest);
server.listen(3000);
console.log("server started at http://localhost:3000");
