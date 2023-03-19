const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const calculator = require('./resources/js/calculator');
const app = express();
const port = 3000;
const expressHbs = require('express-handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));
console.log("path: ", path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine("hbs", expressHbs.engine({ extname: "hbs", defaultLayout: false, layoutsDir: "views/layouts/", }));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/resources/views'));

app.get('/', function (req, res) {
  const optionValues = ["add", "subtract", "multiply", "divide"];
  const selectedOptionObject = optionValues.reduce(
    (acc, option) => ({
      ...acc,
      [option]: option === "add",
    }),
    {}
  );
  res.render('index', {
    selectedOption: selectedOptionObject,
  });
});


app.post('/', (req, res) => {
  const num1 = parseFloat(req.body.num1)
  const num2 = parseFloat(req.body.num2)
  const selectedOption = req.body.operation

  let result

  switch (selectedOption) {
    case "add":
      result = calculator.add(num1, num2);
      break
    case "subtract":
      result = calculator.subtract(num1, num2);
      break
    case "multiply":
      result = calculator.multiply(num1, num2);
      break
    case "divide":
      result = calculator.division(num1, num2);
      break
  }

  const optionValues = ["add", "subtract", "multiply", "divide"];
  const selectedOptionObject = optionValues.reduce(
    (acc, option) => ({
      ...acc,
      [option]: option === selectedOption,
    }),
    {}
  );
  res.render('index', {
    helpers: {
      num1() { return num1 },
      num2() { return num2 },
      result() { return result },
    },
    selectedOption: selectedOptionObject,
  })
})



app.listen(port, () => {
  console.log('Server is running on http://localhost:3000')
})
