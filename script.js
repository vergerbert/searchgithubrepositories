function querySelector(elementClass) {
  try {
    return document.querySelector(elementClass)
  } catch (error) {
    console.log(error)
  }
}

function createElement(elementTag, elementClass) {
  try {
    const element = document.createElement(elementTag)
    if (elementClass) element.classList.add(elementClass)
    return element
  } catch (error) {
    console.log(error)
  }
}

function createAndAppendElement(parent, elementTag, elementClass) {
  try {
    const element = createElement(elementTag, elementClass)
    parent.append(element)
    return element
  } catch (error) {
    console.log(error)
  }
}

const main = querySelector('.main')

const searchForm = createAndAppendElement(main, 'form', 'search-form')
const searchInput = createAndAppendElement(searchForm, 'input','search-input')
const searchDropdown = createAndAppendElement(main, 'div', 'search-dropdown')
const searchRepository = createAndAppendElement(main, 'div', 'search-repository')

searchInput.setAttribute('name', 'name')
searchInput.setAttribute('placeholder', 'Type to search...')

const dropdownList = createAndAppendElement(searchDropdown, 'ul', 'dropdown-list')
const repositoryList = createAndAppendElement(searchRepository, 'ul', 'repository-list')

const url = `https://api.github.com/search/repositories?q=`
let repositories

function debounce(fn, ms) {
  let timeout

  return function(...args) {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      fn.apply(this, args)
    }, ms)
  }
}

function button() {
  try {
    const closeButton = createElement('button', 'close-button')
    const closeImg = createAndAppendElement(closeButton, 'img', 'close-button-img')
    closeImg.src = './svg/close.svg'
  
    closeButton.addEventListener('click', event => {
      event.preventDefault()
      closeButton.parentNode.remove()
    })
  
    return closeButton
  } catch (error) {
    console.log(error)
  }
}

function createDropdown(repository, index) {
  try {
    const dropdownPreview = createAndAppendElement(dropdownList, 'li', 'dropdown-preview')
    dropdownPreview.innerHTML = `<span>${repository.name}</span>`
    dropdownPreview.classList.add(`dropdown-preview${index}`)

    dropdownPreview.addEventListener('click', () => {
      createRepository(repositories[index])
      searchInput.value = ''
      dropdownList.innerHTML = ''
    })
  } catch (error) {
    console.log(error)
  }
}

const generateDropdown = debounce(async () => {
  try {
    const response = await fetch(url + `${searchInput.value}` + `&per_page=${5}`)
    const data = await response.json()
    
    repositories = data.items
    dropdownList.innerHTML = ''

    repositories.forEach((repository, index) => createDropdown(repository, index))

    return repositories
  } catch (error) {
    console.log(error)
  }
}, 250)

function createRepository(data) {
  try {
    const repositoryPreview = createAndAppendElement(repositoryList, 'li', 'repository-preview')
    repositoryPreview.innerHTML = `
      <div class="preview">
        <p class="preview-text"><span>Name: ${data.name}</span></p>
        <p class="preview-text"><span>Owner: ${data.owner.login}</span></p>
        <p class="preview-text"><span>Stars: ${data.stargazers_count}</span></p>
      </div>
    `

    repositoryPreview.append(button())
  } catch (error) {
    console.log(error)
  }
}

searchInput.addEventListener('keyup', () => generateDropdown())
