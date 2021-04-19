/****************** 
    ADICIONAR OBJETO PARA O LOCALSTORAGE ATRAVES DO JSON
*/

// a class Despesa vai receber os elementos recuperados atraves da onclick="cadastrarDespesa" do botao de registro
class Despesa {
    constructor(ano,mes,dia,tipo,descricao,valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    //controle de dados antes de atribuir os elementos nos atributos do objeto
    validarDados() {
        for(let i in this/*percorre o atributo do propio objeto Despesa*/) {
            // recupera o nome do attr e o valor do attr
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }

        return true
    }
}

// a classe Bd vai criar o indice e intanciar o objeto ao indice, gravando no local storage. Ela recupera o indice atual do localstorage e adiciona um novo indice e objeto
class Bd {
    // CRIAÇÃO DE INDICE
    constructor() {
        // recebe o id atual do indice do local storage
        let id = localStorage.getItem('id')

        // inicia com null, atribui o valor zero para correção de bug
        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    // AUTO INCREMENT DOS INDICES - para gravar sempre um novo registro
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    // INSTANCIAR OBJETO NO INDICE 
    gravar(d) /* d está recebendo um parametro do objeto despesa*/ {
        // gravando no storage nomeando o objeto literal como despesa passando os atributos através do JSON.stringify(d) que está recebendo nossa instancia de objeto.

        // RECEBE VALOR INDICE ATUAL+1 DO LOCAL STORAGE
        let id = this.getProximoId()

        // TRANSFORMAR OBJETOS JS EM OBJTO JSON para gravar no Local Storage, passando a chave indice e o objeto
        localStorage.setItem(id/*chave de cada (do) registro*/, JSON.stringify(d)/* objeto (d) é o parametro do objeto*/)

        // gravar id e valor do id no indice do local storage, ja transformado com a notacao do json
        localStorage.setItem('id', id)
    }

    // RECUPERAR TODOS OS REGISTROS DO BANCO DE DADOS
    recuperarTodosRegistros() {
        //array de despesas
        let despesas = Array()

        // receber ultimo id cadastrado nas despesas em localstorage
        let id = localStorage.getItem('id')

        // atraves do ultimo registro, realizar a inserção de um novo objeto
        for (let i = 1; i <= id; i++) {
            //recuperar a despesa
            //retorna a notação JSON para objeto literal - JSON.parse()
            let despesa = JSON.parse(localStorage.getItem(i))


            // verificar possibilidade de haver indices removidos
            // nesse caso vamos literalmente pular esses indices
            if (despesa === null) {
                continue // quando identificado faz com que o laço avance para a proxima interaçao do laço assim ignorando o push caso aquele indice nao exista
            }

            // metodo para inclui o objeto despesa ao final do indice array despesas
            despesa.id = i
            despesas.push(despesa)
        }  

        return despesas
    }

    // METODO PARA PESQUISAR AS DESPESAS, UTILIZANDO O METODO RECUPERAR TODOS OS REGISTROS
    pesquisar(despesa) {
        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        
        //mes
        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    // METODO PARA REMOVER A NOTACAO JSON, RECEBENDO COMO PARAMETRO, O KEY DO PROPIO 
    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()


// a functiion cadastrarDespesa despesas vai recuperar os elementos para aplicar no objeto do js
function cadastrarDespesa() {
    // RECUPERAR ELEMENTOS E INSTANCIAR EM UM OBJETO OS RESPECTICOS ATTR.

    //recuperar elementos
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')
    // atribuir elementos para os atributos do objeto   
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    // Processo de validacao de dados antes de gravar a despesa no bd
    if (despesa.validarDados()) {
        //sucesso

        // chamar o método do objeto para gravar no localstorage atraves da notação de objeto JSON
        bd.gravar(despesa)

        //titulo
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'

        //conteudo
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'

        //btn
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'

        //exibir dialog modal de sucesso
        $('#modalRegistraDespesa').modal('show')

        // limpar campos apos registrar
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        //erro

        //titulo
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'

        //conteudo
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente.'

        //btn
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        //exibir dialog modal de erro
        $('#modalRegistraDespesa').modal('show')
    }
}

// a function carregaListaDespesas vai carregar as despesas, excluir e filtralas
function carregaListaDespesas(despesas = Array(), filtro = false) {
    // verificar se é um filtro antes de exibir todos os registro
    if (despesas.length == 0 && filtro == false) {
        // recupera a array retornada do método recuperarTodosRegistros, onde lista todos os objetos despesa
        despesas = bd.recuperarTodosRegistros()
    }

    // selecionando elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')

    //limpar campos antes da inserção do conteudo
    listaDespesas.innerHTML = ''

    /* exemplo da td que esta dentro da tbody#listaDespesas
        <tr>
          0 =  <td>15/03/2018</td>
          1 =  <td>Alimentação</td>
          2 =  <td>Compras do mês</td>
          3 =  <td>447.75</td>
        </tr>
    */

    //percorrer array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function(d /* d é a despesa recuperada em cada um dos indices do nosso array de despesas */){
        // criando a linha (tr) - array.insertRow()
        let linha = listaDespesas.insertRow()

        //criar as colunas
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}
        `
        // nomear tipo
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
            break
            case '2': d.tipo = 'Educação'
            break
            case '3': d.tipo = 'Lazer'
            break
            case '4': d.tipo = 'Saúde'
            break
            case '5': d.tipo = 'Transporte'
            break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar botão de exclusao
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = (`id_despesa${d.id}`) // recupera o id do objeto despesa e cria um id nesse btn
        btn.onclick = function() {
            /*remover a despesa*/
            let id = this.id.replace('id_despesa', '') // recupera o id do objeto e aplica o método de remoção na classe do bd, onde justamente meche com o objeto do JSON

            
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn) // append faz a inclusao do elemento
    })
}

// passar os parametros recebidos dos elementos para a pesquisa das despesas e carregando através da passagem de parametros para a function que carregalas.
function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, filtro = true /*toda vez que for usado o filtro, ele ira ser acionadoa através do if em carregaListaDespesas()*/)
}