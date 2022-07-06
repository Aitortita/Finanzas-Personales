

export function totalRegalo(usuario: any, status: any) {
  
  const date = `${new Date().getFullYear()}-${String(new Date().getMonth()).length < 2 ? "0" + String(new Date().getMonth() + 1) : String(new Date().getMonth())}`

 let extraRegalo = status === "succes" && usuario?.extra.input?.find((e: any) => e.date === date)

 extraRegalo = extraRegalo ? extraRegalo.entries?.reduce((prev: any, actual: any) => {
  return prev + actual.amount
 }, 0):0

  }

  export function totalTransporte(usuario: any) {

    const extras1 = usuario.extra.input.filter(
      (e: any) => e.category === "Transporte"
    );
    const total1 = extras1.reduce((prev: any, actual: any) => {
      return prev + actual.amount;
    }, 0);

    const extras2 = usuario.monthly.input.filter(
      (e: any) => e.category === "Transporte")
      
      const total2 = extras2.reduce((prev: any, actual: any) => {
        return prev + actual.amount;
      }, 0);

    const total = total1 + total2

    return total;
  }

  export function totalOcio(usuario: any) {

    const extras = usuario.extra.input.filter(
      (e: any) => e.category === "Ocio"
    );
    const total = extras.reduce((prev: any, actual: any) => {
      return prev + actual.amount;
    }, 0);

    return total;
  }

  export function totalAlimentos(usuario: any) {
    const extras = usuario.extra.input.filter(
      (e: any) => e.category === "Alimentos"
    );
    const total = extras.reduce((prev: any, actual: any) => {
      return prev + actual.amount;
    }, 0);

    return total;
  }

  export function totalSalud(usuario: any) {

    const extras1 = usuario.extra.input.filter(
      (e: any) => e.category === "Salud"
    );
    const total1 = extras1.reduce((prev: any, actual: any) => {
      return prev + actual.amount;
    }, 0);

    const extras2 = usuario.monthly.input.filter(
      (e: any) => e.category === "Salud"
    );

    const total2 = extras2.reduce((prev: any, actual: any) => {
      return prev + actual.amount;
    }, 0);

    const total = total1 + total2
     
    return total;
  }

  export function totalAlquiler(usuario: any){

    const extras = usuario.monthly.input.filter(
      (e: any) => e.category === "Alquiler")
      
      const total = extras.reduce((prev: any, actual: any) => {
        return prev + actual.amount;
      }, 0);
      return total
  }

  export function totalGimnasio(usuario: any){
    
    const extras = usuario.monthly.input.filter(
      (e: any) => e.category === "Gimnasio")
      
      const total = extras.reduce((prev: any, actual: any) => {
        return prev + actual.amount;
      }, 0);
      return total
  }

  export function totalOther(usuario: any){
    
    const extras2 = usuario.extra.input.filter(
      (e: any) => e.category === "Otros")
    
      const total2 = extras2.reduce((prev: any, actual: any) => {
        return prev + actual.amount;
      }, 0);
    
    
    const extras1 = usuario.monthly.input.filter(
      (e: any) => e.category === "Otros")
      
      const total1 = extras1.reduce((prev: any, actual: any) => {
        return prev + actual.amount;
      }, 0);

      const total = total1 + total2

      return total
  }
