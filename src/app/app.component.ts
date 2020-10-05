import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pwa-example';
  offline: boolean;
  promptEvent;
  needToInstall = false;
  executingSource = 'browser';

  constructor(public updates: SwUpdate) {
    // verifica se possui atualização do service worker
    updates.available.subscribe(event => {
      console.log('atualizaçao do service worker');
      window.location.reload();
    });
  }

  ngOnInit() {
    // verifica se o aplicativo ja esta instalado
    window.addEventListener('appinstalled', (evt) => {
      console.log('INSTALL: Success', evt);
      this.needToInstall = false;
      this.executingSource = 'standalone';
    });

    // escuta o status da conexão da página
    window.addEventListener('online',  this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
    window.addEventListener('beforeinstallprompt', event => {
      console.log('beforeinstallprompt', event);
      this.needToInstall = true;
      this.promptEvent = event;
    });

    // verifica se esta rodando no aplicativo
    window.addEventListener('DOMContentLoaded', () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.executingSource = 'standalone';
        console.log('DISPLAY_MODE_CHANGED', this.executingSource);
      }
    });
  }

  onNetworkStatusChange() {
    this.offline = !navigator.onLine;
    console.log('offline ' + this.offline);
  }

  installPwa() {
    console.log('installPwa');
    this.promptEvent.prompt();
    this.promptEvent.userChoice.then(result => {
      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  }

  // TODO getRelatedApps = https://web.dev/get-installed-related-apps/
  // TODO cache control
}
