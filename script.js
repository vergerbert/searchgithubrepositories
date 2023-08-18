/* ----------------------------------------------------- */

const url = `https://api.github.com/search/repositories?q=`

function querySelector(elementClass) {
  const element = document.querySelector(elementClass)
  return element
}

function createElement(elementTag, elementClass) {
  const element = document.createElement(elementTag)
  if (elementClass) element.classList.add(elementClass)
  return element
}

/* ----------------------------------------------------- */

const main = querySelector('.main')

const searchForm = createElement('form', 'search-form')
const searchInput = createElement('input','search-input')
const searchDropdown = createElement('div', 'search-dropdown')
const searchRepository = createElement('div', 'search-repository')

searchInput.setAttribute('name', 'name')
searchInput.setAttribute('placeholder', 'Type to search...')

const dropdownList = createElement('ul', 'dropdown-list')
const repositoryList = createElement('ul', 'repository-list')

main.append(searchForm)
main.append(searchDropdown)
main.append(searchRepository)

searchForm.append(searchInput)
searchDropdown.append(dropdownList)
searchRepository.append(repositoryList)

function createDeleteButton(item) {
  try {
    const closeButton = createElement('button', 'close-button')
    const closeImg = createElement('img', 'close-button-img')
    closeImg.src = './svg/close.svg'
  
    closeButton.append(closeImg)
    closeButton.addEventListener('click', item => {
      item.preventDefault()
      closeButton.parentNode.remove(item)
    })
  
    return closeButton
  } catch(error) {
    console.log(error)
  }
}

/* ----------------------------------------------------- */

function debounceInput (fn, ms) {
  let timeout

  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, arguments), ms)
  }
}

async function loading(value, page) {
    return await fetch(url + `${value}` + `&per_page=${page}`)
}

function clearDropdown() {
  return dropdownList.innerHTML = ''
}

/* ----------------------------------------------------- */

function createDropdown(data) {
  try {
    const dropdownPreview = createElement('li', 'dropdown-preview')
    dropdownPreview.innerHTML = `<span>${data.name}</span>`
    dropdownList.append(dropdownPreview)
  
    dropdownPreview.addEventListener('click', generateRepository)
    dropdownPreview.addEventListener('click', item => {
      item.preventDefault()
      dropdownPreview.parentNode.remove(dropdownPreview)
    })
  } catch(error) {
    console.log(error)
  }
}

const returnFunction = debounceInput(async function generateDropdown() {
  try {
    clearDropdown()
    if (searchInput.value) {
      loading(searchInput.value, 5)
      .then(response => {
        response.json()
        .then(response => {
          response.items.forEach(repository => createDropdown(repository))
        })
      })
    }
  } catch(error) {
    console.log(error)
  }
}, 250)

function createRepository(data) {
  try {
    const repositoryPreview = createElement('li', 'repository-preview')
    repositoryPreview.innerHTML = `
      <div class="preview">
        <p class="preview-text"><span>Name: ${data.name}</span></p>
        <p class="preview-text"><span>Owner: ${data.owner.login}</span></p>
        <p class="preview-text"><span>Stars: ${data.stargazers_count}</span></p>
      </div>
    `
  
    repositoryList.append(repositoryPreview)
    repositoryPreview.append(createDeleteButton(repositoryPreview))
  } catch(error) {
    console.log(error)
  }
}

async function generateRepository(element) {
  try {
    element.preventDefault()
    if (searchInput.value) {
      loading(searchInput.value, 1)
      .then(response => {
        response.json()
        .then(response => {
          response.items.forEach(repository => createRepository(repository))
        })
      })
    }
  } catch(error) {
    console.log(error)
  }
}

/* ----------------------------------------------------- */

searchInput.addEventListener('keyup', returnFunction)
