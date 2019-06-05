function initPage() {
    createProjects();
    renderProjects();
    $('.projModal').hide();
}

function renderProjects() {
    var elContainer = document.querySelector('.projects-container');

    var strHtmls = gProjects.map(function(proj){
        return `<div class="${proj.id} portfolio-item">
                    <div class="portfolio-link" data-toggle="modal" onclick="onOpenProjModal('${proj.id}')">
                        <div class="portfolio-hover">
                            <div class="portfolio-hover-content">
                                <i class="fa fa-plus fa-3x"></i>
                            </div>
                        </div>
                            <img class="portfolio-img" src="${proj.img}" onerror="onImgError(${proj.id})" alt="">
                    </div>
                        <div class="portfolio-caption">
                            <h4>${proj.title}</h4>
                            <p class="portfolio-text">${proj.desc}</p>
                        </div>
                </div>`
    })
    
    elContainer.innerHTML = strHtmls.join('');;
}

function onImgError(projId) {
    console.log(projId);
    document.querySelector('.'+projId+' img').src='img/portfolio/default.jpg';
}

function onOpenProjModal(projId) { 
    var proj = getProjById(projId);
    $('.modal-title').text(proj.name);
    $('.proj-title').text(proj.title);
    $('.proj-description').text(proj.desc);
    $('.publishedAt').text(proj.publishedAt);
    $('.lables').text(proj.labels.join(''));
    $('.modal-img').attr('src',proj.img);
    $('.modal-img').attr('onerror',"onImgError()");
    $('.projLink').attr('href',proj.projUrl);
    $('.codeLink').attr('href',proj.codeUrl);
    $('.projModal').show();
}

function onCloseModal() {
    $('.projModal').hide();
}

function onContactMe() {
    var email = document.querySelector('[name="mail"]').value;
    var subject = document.querySelector('[name="subject"]').value;
    var text = document.querySelector('[name="text"]').value;
    var url = 'https://mail.google.com/mail/?view=cm&fs=1&to='+email+'&su='+subject+'&body='+text;
    window.open(url);
    
    document.querySelector('[name="mail"]').value = '';
    document.querySelector('[name="subject"]').value = '';
    document.querySelector('[name="text"]').value = '';
}