import { Uri, Webview } from 'vscode';

import { Output } from '../../Output';

import { DashboardContent } from './DashboardContent';
import { DashboardContentOptions } from './DashboardContentOptions';

export class DashboardCommandHandler {
  outputList: Output[] = [];
  webview: Webview;
  dashboardContent: DashboardContent;

  constructor(webview: Webview, styleURI: Uri, scriptURI: Uri, options: DashboardContentOptions) {
    this.webview = webview;
    this.dashboardContent = new DashboardContent(styleURI, scriptURI, options);
    this.webview.html = this.dashboardContent.getDashboardContent(this.outputList);
  }

  clearWebView() {
    this.outputList = [];
    this.webview.html = this.dashboardContent.getDashboardContent(this.outputList);
  }

  updateOutputList(output: Output) {
    this.outputList.push(output);
    this.webview.html = this.dashboardContent.getDashboardContent(this.outputList);
  }
}
