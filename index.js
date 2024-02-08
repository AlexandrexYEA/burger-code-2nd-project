const express = require('express');
const uuid = require('uuid');
const port = 3000;
const app = express();
app.use(express.json());


const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Order not found " })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const logRequest = (request, response, next) => {

    const url = request.url
    const method = request.method

    console.log(url)
    console.log(method)

    next()

};


app.get('/order', logRequest, (request, response) => {

    return response.json(orders)
});


const status = "em preparo"
app.post('/order', logRequest, (request, response) => {
    const { order, clientName, price } = request.body

    const allOrder = { id: uuid.v4(), order, clientName, price, status }

    orders.push(allOrder)


    return response.status(201).json(orders)
})




app.put('/order/:id', checkOrderId, logRequest, (request, response) => {
    const { order, clientName, price } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = { id, order, clientName, price }

    orders[index] = updatedOrder

    return response.json(updatedOrder)

})

app.delete('/order/:id', checkOrderId, logRequest, (request, response) => {

    const index = request.orderIndex


    orders.splice(index, 1)


    return response.status(204).json()
})


app.patch('/order/:id', checkOrderId, logRequest, (request, response) => {


    const index = request.orderIndex;

    
    orders[index].status = "Pronto";

    return response.json(orders[index]);


})



app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}.`);
});



