const express = require('express')
const models = require('./models')
const bodyParser = require('body-parser')
const session = require('express-session')
var app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

//set engine
app.set('view engine', 'ejs');
//static public
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'iloveit',
  // resave: true,
  // saveUninitialized: true
  // cookie: {
  //   maxAge: 60000 * 60
  // } //10 detik
}));

var user = models.User
var product = models.Product
var order = models.Order

//GET
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/product')
    // console.log(req.session.user);
  } else {
    res.render('pages/index.ejs')

  }
})
//LOGIN
app.post('/login', function(req, res) {
  user.findOne({
    where: {
      fullName: req.body.fullName
    }
  }).then((data) => {
    if (data == 0) {
      console.log('data kosong');
      res.redirect('/')
    }else if (data.password === req.body.password) {
      if (data.isAdmin === true) {
        req.session.admin = data.isAdmin
        res.redirect('/panel')
      }
      req.session.user = data.id

      res.redirect('/product')
      res.end()
    }
    res.redirect('/')
    res.end()


  }).catch((err) => {
    console.log(err);
    res.redirect('/')
  })
})

//panel admin
app.get('/panel', (req, res) => {
  if (!req.session.admin) {
    res.redirect('/')
  }
  order.findAll({
    include : [{model: user}, {model: product}]
  }).then((data)=>{
    // res.send(data)
    console.log('transaksi :',data.length)
    console.log(data.length)
    var arr = []
    for (d of data) {
      d.statusOrder === true ? d.statusOrder = 'SUDAH' : d.statusOrder = 'belum'
      console.log(`${d.User.fullName} membeli ${d.Product.productName} dengan harga ${d.Product.price} di kirim ke : ${d.User.address} status pembayaran ${d.statusOrder}`);
      arr.push([d.User.fullName,d.Product.productName,d.Product.price,d.User.address,d.statusOrder])
    }
    console.log(arr);
    res.render('pages/panel',{data : arr})
  })
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})


app.get('/product', (req, res) => {
  if (!req.session.user) {
    res.redirect('/')
  }
  product.findAll().then((products) => {
    res.render('pages/product.ejs', {
      products
    })
  }).catch((err) => {
    console.log(err);
  })
})

app.get('/panel/product', (req, res) => {
  if (!req.session.admin) {
    res.redirect('/')
  }
  product.findAll().then((products) => {
    res.render('pages/admin-product-list.ejs', {
      products
    })
  }).catch((err) => {
    console.log(err);
  })
})


app.get('/user', (req, res) => {
  user.findAll().then((users) => {
    console.log(users);
    res.send(users)
  }).catch((err) => {
    console.log(err);
  })
})

///daftar
app.get('/register', (req, res) => {
  res.render('pages/register')
})
app.post('/register', (req, res) => {
  user.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    contact: req.body.contact,
    isAdmin: false
  }).then((costumer) => {
    console.log(costumer);
    res.redirect('/')
  }).catch((err) => {
    console.log('costumerDb :', err);
    res.redirect('/register')
  })

})


//bikin orderan
app.post('/order/:productId', (req, res) => {

  if (!req.session.user) {
    res.redirect('/')
  } else {
    order.create({
      costumerId: parseInt(req.session.user),
      productId: parseInt(req.params.productId),
      statusOrder: false //default

    }).then((product) => {
      console.log(product);
      res.redirect('/product')
    }).catch((err) => {
      console.log('costumerDb :', err);
    })
  }

})
//ganti status orderan bayar
app.post('/status-order/:orderId',(req,res)=>{
  if (!req.session.user) {
    res.redirect('/')
  }
  order.findOne({
    where :{
      costumerId : req.session.user,
      id : req.params.orderId
    }
  }).then((data)=>{
    if (data === null) {
      console.log('data kosong');
    }
    data.update({
      statusOrder : true
    }).then((succes)=>{
      console.log('succes ganti status');
      res.redirect('/orders')
    })
  })
})
//delete status
app.post('/delete-order/:orderId',(req,res)=>{
if (!req.session.user) {
  res.redirect('/')
}
  order.destroy({
    where :{
      costumerId : req.session.user,
      id : req.params.orderId
    }
  }).then((data)=>{
    console.log('berhasil di hapus');
      res.redirect('/orders')
  })
})

//create product
app.get('/panel/create-product', (req,res)=>{
  res.render('pages/create-product.ejs')
})

app.post('/create-product', (req, res) => {
  if (!req.session.admin) {
    res.redirect('/')
  }
  product.create({
    productName: req.body.productName,
    description: req.body.description,
    price: req.body.price,
  }).then((product) => {
    console.log(product);
    res.redirect('/panel/create-product')
  }).catch((err) => {
    console.log('costumerDb :', err);
  })

})


//destroy
app.post('/user/:id', (req, res) => {
  var id = req.params.id
  user.destroy({
    where: {
      id: id
    }
  }).then((data) => {
    console.log(data);
    res.redirect('/user')
  }).catch((err) => {
    console.log(err);
  })
})

///cart
app.get('/orders', (req, res) => {
  if (!req.session.user) {
    res.redirect('/')
  }
  order.findAll({
    where: {
      costumerId: req.session.user,
      statusOrder : false
    },
    include: [{
      model: product
    }, {
      model: user
    }]
  }).then(function(data) {
    console.log(data.length);


    // res.send(data)
    res.render('pages/myorder', {
      data: data
    })
  })
})

app.get('/payed', (req, res) => {
  if (!req.session.user) {
    res.redirect('/')
  }
  order.findAll({
    where: {
      costumerId: req.session.user,
      statusOrder : true
    },
    include: [{
      model: product
    }, {
      model: user
    }]
  }).then(function(data) {
    console.log(data.length);
    var arr = []
    for (var i in data) {
      arr.push(data[i].Product);
    }
    // console.log(arr);
    res.render('pages/payed', {
      beli: arr
    })
  })
})

app.listen('3000', () => console.log('SERVER run in 3000'))
