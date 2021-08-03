const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $send_location = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight - 1 <= Math.round(scrollOffset)) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm A MMM YYYY')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    const bg = document.getElementById('bg')
    bg.style.backgroundColor = '#333333'
    const element = document.querySelectorAll('.message')
    for (var i = 0, max = element.length; i < max; i++) {
        element[i].style.backgroundColor = "#0052cc";
        element[i].style.borderRadius = "15px";
        element[i].style.marginRight = "50%";
        element[i].style.marginLeft = "0";
        element[i].style.color = "black";
    }
    var myStringArray = document.getElementsByClassName(username.toLowerCase());
    for (var i = 0, max = myStringArray.length; i < max; i++) {
        myStringArray[i].style.backgroundColor = "aqua";
        myStringArray[i].style.borderRadius = "15px";
        myStringArray[i].style.marginRight = "0";
        myStringArray[i].style.marginLeft = "50%";
        myStringArray[i].style.color = "black";
    }
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm A MMM YYYY')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    const bg = document.getElementById('bg')
    bg.style.backgroundColor = '#333333'
    const element = document.querySelectorAll('.message')
    for (var i = 0, max = element.length; i < max; i++) {
        element[i].style.backgroundColor = "#0052cc";
        element[i].style.borderRadius = "15px";
        element[i].style.marginRight = "50%";
        element[i].style.marginLeft = "0";
        element[i].style.color = "black";
    }
    var myStringArray = document.getElementsByClassName(username.toLowerCase());
    for (var i = 0, max = myStringArray.length; i < max; i++) {
        myStringArray[i].style.backgroundColor = "aqua";
        myStringArray[i].style.borderRadius = "15px";
        myStringArray[i].style.marginRight = "0";
        myStringArray[i].style.marginLeft = "50%";
        myStringArray[i].style.color = "black";
    }
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }

        console.log('Message delviered')
    })
})

$send_location.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $send_location.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $send_location.removeAttribute('disabled')
            console.log('Location shared')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})