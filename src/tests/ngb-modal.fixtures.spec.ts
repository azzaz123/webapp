const modalRef: any = {
  result: Promise.resolve({}),
  componentInstance: {},
};

export class NgbModalMock {
  open() {
    return modalRef;
  }
}
