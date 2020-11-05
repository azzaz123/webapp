import { TestBed } from '@angular/core/testing';
import { HereMapsService, HERE_MAPS_CORE_URL } from './here-maps.service';


describe('HereMapsService', () => {
  let service: HereMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HereMapsService);
  });

  it('should be created', () => {
    service.isLibraryReady
    console.log(document.head)
    expect(service).toBeTruthy();
  });

/*  it('should append valid script to DOM', () => {
    service.appendHereMapsCoreToDOM();

    const result = document.getElementById(HERE_MAPS_CORE_ID);
    expect(result).toBeDefined();
    expect(result.getAttribute('src')).toBe(HERE_MAPS_CORE_URL);
    expect(result.getAttribute('type')).toBe('text/javascript');
    expect(result.getAttribute('charset')).toBe('utf-8');
}); */
});


/*  describe('Here-Maps', () => {
     describe('Core', () => {
         it('should have URL with valid format', () => {
             expect(URL_REGEX.test(HERE_MAPS_CORE_URL)).toBeTruthy();
         });

         describe('appendHereMapsCoreToDOM', () => {
             it('should append valid script to DOM', () => {
                 appendHereMapsCoreToDOM();

                 const result = document.getElementById(HERE_MAPS_CORE_ID);
                 expect(result).toBeDefined();
                 expect(result.getAttribute('src')).toBe(HERE_MAPS_CORE_URL);
                 expect(result.getAttribute('type')).toBe('text/javascript');
                 expect(result.getAttribute('charset')).toBe('utf-8');
             });

             it('should not append script if already exists', () => {
                 spyOn(document.head, 'appendChild').and.callThrough();
                 const coreRef = document.getElementById(HERE_MAPS_CORE_ID);
                 document.head.removeChild(coreRef);

                 appendHereMapsCoreToDOM();
                 appendHereMapsCoreToDOM();

                 expect(document.head.appendChild).toHaveBeenCalledTimes(1);
             });
         });

     });

     describe('Service', () => {
         it('should have URL with valid format', () => {
             expect(URL_REGEX.test(HERE_MAPS_SERVICE_URL)).toBeTruthy();
         });

         describe('appendHereMapsServiceToDOM', () => {
             it('should append valid script to DOM', () => {
                 appendHereMapsServiceToDOM();

                 const result = document.getElementById(HERE_MAPS_SERVICE_ID);
                 expect(result).toBeDefined();
                 expect(result.getAttribute('src')).toBe(HERE_MAPS_SERVICE_URL);
                 expect(result.getAttribute('type')).toBe('text/javascript');
                 expect(result.getAttribute('charset')).toBe('utf-8');
             });

             it('should not append script if already exists', () => {
                 spyOn(document.head, 'appendChild').and.callThrough();
                 const serviceRef = document.getElementById(HERE_MAPS_SERVICE_ID);
                 document.head.removeChild(serviceRef);

                 appendHereMapsServiceToDOM();
                 appendHereMapsServiceToDOM();

                 expect(document.head.appendChild).toHaveBeenCalledTimes(1);
             });
         });
     });
 }); */
