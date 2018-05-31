let url = axios(
          {
            method:'get',
            url:that.ruleForm.url,
            headers:{"content-type":"text/html","Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
          }
          ).then(res => {
            if(res.statusText == "OK"){
              that.editorHtml = res.data
              resolve("success")
            } else {
              alert("fail")
            }
          }).catch(err => {
            console.log()
          })