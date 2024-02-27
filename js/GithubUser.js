export class GithubUser{
  static async search(username){
    const endpoint = `https://api.github.com/users/${username}`;
    const resp = await fetch(endpoint);
    const respConvertida = await resp.json();

    const { name, login, public_repos, followers } = respConvertida;

    return {name, login, public_repos, followers};
  }
}