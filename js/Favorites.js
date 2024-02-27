import { GithubUser } from "./GithubUser.js";

export class Favorites{
  entries = [];
  constructor(root){
    this.root = document.querySelector(root);
    this.load();
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || [];
  }

  save(){
    localStorage.setItem("@github-favorites",JSON.stringify(this.entries));
  }

  delete(user){
    this.entries = this.entries.filter(entry => entry.login !== user.login);
    this.save();
    this.uptdate();
    
    if(this.entries.length == 0) this.AddNoUsers();
  }
}

export class FavoritesView extends Favorites{
  constructor(root){
    super(root);
    this.tbody = this.root.querySelector('tbody');
    this.uptdate();
    this.onAdd()
  }

  async add(username){
    const userExists = this.entries.find(user => user.login === username);

    if(userExists) {
      alert("Usuário já adicionado à lista de favoritos.");
      return;
    }

    const user = await GithubUser.search(username);
    
    if(user.login === undefined) {
      alert("Usuário não encontrado!");
      return;
    }

    this.entries = [user, ...this.entries];

    this.save();
    this.uptdate();
  }

  uptdate(){
    if(this.entries.length == 0){
      this.AddNoUsers();
    } else {
      this.removeNoUsers();
    }

    this.removeRows();

    this.entries.forEach(user => {
      const row = this.creatRows();
      this.editRow(user, row);
    });
  }

  removeRows(){
    const rows = this.tbody.querySelectorAll('tr');
    rows.forEach(row => {
      row.remove();
    });
  }

  creatRows(){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="user">
        <img src="/assets/Ellipse 3.png" alt="Imagem de ">
        <a href="">
          <p></p>
          <span></span>
        </a>
      </td>
      <td class="respositories"></td>
      <td class="followers"></td>
      <td class="remove">Remover</td>
    `

    return tr;
  }

  editRow(user, row){
    row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
    row.querySelector('.user img').alt = `Imagem de ${user.name}`;
    row.querySelector('.user a').href = `https://github.com/${user.login}`;
    row.querySelector('.user a').target = "_blank";
    row.querySelector('.user a p').textContent = `${user.name}`;
    row.querySelector('.user a span').textContent = `/${user.login}`;
    row.querySelector('.respositories').textContent = `${user.public_repos}`;
    row.querySelector('.followers').textContent = `${user.followers}`;

    row.querySelector('.remove').onclick = () => {
      const isOk = confirm("Tem certeza que deseja remover essa linha?");
      if(isOk) this.delete(user);
    }

    this.tbody.append(row);
  }

  AddNoUsers(){
    const elementNoUser = this.root.querySelector('.table-wrapper #noFav-wrapper');

    elementNoUser.classList.add('noUsers');
    
    const noFavContent = this.root.querySelector('.table-wrapper #noFav-wrapper .noFav')
    noFavContent.innerHTML = `
      <img src="assets/Estrela.png" alt="">
      <span>Nenhum favorito ainda</span>
    `
  }

  removeNoUsers(){
    const elementNoUser = this.root.querySelector('.table-wrapper #noFav-wrapper');
    elementNoUser.classList.remove('noUsers');
    const noFavContent = this.root.querySelector('.table-wrapper #noFav-wrapper .noFav')
    noFavContent.innerHTML = '';
  }

  onAdd(){
    const btnFav = this.root.querySelector('.search');
    btnFav.onclick = (e) => {
      e.preventDefault();
      const { value } = this.root.querySelector('#inUser');
      this.add(value);
    }
  }
}