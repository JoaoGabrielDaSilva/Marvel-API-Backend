import axios from 'axios'

export default class App {
    constructor() {
        this.currentPage = 1
        this.currentPagePath = null
        this.filter = document.getElementById('filter')
        this.searchBox = document.getElementById('search-box')
        this.heroList = document.getElementsByClassName('hero-list')[0]
        this.pages = document.getElementsByClassName('pages')[0]
        this.containerHome = document.getElementsByClassName('container-home')[0]
        this.details = document.getElementsByClassName('container-details')[0]
        this.back = document.getElementById('back')
        this.collection = document.getElementById('collection')
    }

    populate(pagination = true) {
        this.heroList.innerHTML = ''
        axios.get(`http://localhost:3030/characters?offset=${this.currentPage - 1}`)
            .then(response => {
                response.data.forEach(element => {
                    const card = this.createCard()
                    this.addInfo(element, card)
                    this.addEvents(card)
                });
                if (pagination) {
                    this.setPagination(response.data[0].total)
                    this.addEventSearch()
                }
                this.pages.classList.remove('unactive')
            })
            .catch()
        
    }

    createCard() {
        const container = document.getElementsByClassName('hero-list')[0]

        const card = document.createElement('div')
        card.classList.add('card')
        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')
        const cardImage = document.createElement('div')
        cardImage.classList.add('card-image')
        const cardName = document.createElement('div')
        cardName.classList.add('card-name')

        const img = document.createElement('img')
        const h5 = document.createElement('h5')

        cardImage.appendChild(img)
        cardName.appendChild(h5)
        cardBody.appendChild(cardImage)
        cardBody.appendChild(cardName)
        card.appendChild(cardBody)
        container.appendChild(card)

        return card
    }

    addInfo(info, card) {
        
        card.setAttribute('data-id', `${info.id}`)
        const cardChildren = card.childNodes[0]
        cardChildren.childNodes[0].childNodes[0].setAttribute('src', `${info.image}.${info.imageFormat}`)
        cardChildren.childNodes[1].childNodes[0].innerText = `${info.name}`
    }

    addEvents(card) {
        card.addEventListener('click', (event) => this.getDetails(event))
        this.back.addEventListener('click', () => {
            this.containerHome.classList.remove('unactive')
            this.details.classList.add('unactive')
            this.collection.innerHTML = ''
        })
    }

    getDetails(event) {
        const id = (parseInt(event.path[3].dataset.id, 10))
        const res = axios.get(`http://localhost:3030/character/details?id=${id}`)
            .then(data => {

                const comics = data.data.comics

                this.containerHome.classList.add('unactive')
                this.details.classList.remove('unactive')
                this.populateDetails(data.data)

                comics.forEach(item => {
                    const card = this.createCollectionHQ()
                    this.createCollectionHQInfo(card, item)
                }) 
            })
            .catch()
    }

    populateDetails(data) {
        const heroImage = document.getElementById('hero-image')
        const heroName = document.getElementById('hero-name')
        const heroDescription = document.getElementById('hero-description')

        heroImage.setAttribute('src', `${data.image}.${data.imageFormat}`)
        heroName.innerText = `${data.name}`
        heroDescription.innerText = `${data.description}`
    }

    createCollectionHQ() {
        const container = document.getElementById('collection')

        const hqCard = document.createElement('div')
        hqCard.classList.add('hq-card')
        const hqImage = document.createElement('div')
        hqImage.classList.add('hq-card-image')
        const title = document.createElement('h5')

        const img = document.createElement('img')

        hqImage.appendChild(img)

        hqCard.appendChild(hqImage)
        hqCard.appendChild(title)

        container.appendChild(hqCard)

        return hqCard
    }

    createCollectionHQInfo(card, info) {
        const image = card.querySelector('img')
        const title = card.querySelector('h5')

        if (info.images.length > 0) {
            image.setAttribute('src', `${info.images[0].path}/portrait_xlarge.${info.images[0].extension}`)
        } else {
            image.setAttribute('src', `https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.biotecdermo.com.br%2Fpele-jovem-aos-40%2Fsem-imagem-11%2F&psig=AOvVaw3W-vkoBAxC6IabPxtKyyTQ&ust=1611022954854000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPjYn6a2pO4CFQAAAAAdAAAAABAI`)
        }
        title.innerText = `${info.title}`
    }

    addEventSearch() {
        this.searchBox.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.getCharacter()
            }
        })

        this.searchBox.addEventListener('keyup', () => {
            if (!this.searchBox.value) {
                this.populate(false)
            }
        })
    }

    getCharacter() {
        const value = this.searchBox.value

            const resp = axios.get(`http://localhost:3030/character?name=${value}`)
                .then(response => {
                    if (response.data) {
                        this.heroList.innerHTML = ''
                        this.pages.classList.add('unactive')
                        const card = this.createCard()
                        this.addInfo(response.data, card)
                        this.addEvents(card)
                        return 
                    }
                    this.heroList.innerHTML = `
                        <h1>Sem resultados</h1>
                    `
                    this.pages.classList.add('unactive')
                })
                .catch()  

    }

    setPagination(total) {
        const pages = Math.ceil(total / 20) - 1

        const container = document.getElementsByClassName('pages')[0]

        if (this.currentPage - 5 < 1) {
            this.currentPage = 1
        } else if (this.currentPage + 5 > pages) {
            this.currentPage = pages - 10
        } else {
            this.currentPage -= 5
        }
        
        for (let i = this.currentPage; i < 10 + this.currentPage; i += 1) {
            const ul = document.createElement('ul')
            const li = document.createElement('li')
            li.classList.add('page-number')
            li.innerText = `${i}`
            ul.appendChild(li)
            container.appendChild(ul)
        }

        this.addEventsPages() 
    }

    addEventsPages() {
        const container = document.getElementsByClassName('page-number')
        
        for (let button of container) {
            button.addEventListener('click', (event) => this.getScreen(event))
        }
    }

    getScreen(event) {
        this.currentPage = parseInt(event.path[0].textContent, 10)
        const containerList = document.getElementsByClassName('hero-list')[0]
        const containerPages = document.getElementsByClassName('pages')[0]
        containerList.innerHTML = ''
        containerPages.innerHTML = ''
        this.populate(false)
    }
}