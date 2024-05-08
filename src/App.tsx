import 'bootstrap/dist/css/bootstrap.css'
import { FormEvent, useEffect, useState } from 'react'
import './App.css'
import { Books } from './assets/Book'


function App() {
  const [books,setbooks]=useState([]as Books[])
  const [author,setauthor]=useState('');
  const [page_count,setpage_count]=useState(0);
  const [ publish_year,setpublish_year]=useState(0);
  const [title,settitle]=useState('')
  const [Error,setError]=useState('')

  
  async function NewBook(e:FormEvent) {
    e.preventDefault();
    const data={title,author, publish_year,page_count}

    try{
   const response=await fetch('http://localhost:3000/api/books',{
      method:"Post",
      body:JSON.stringify(data),
      headers:{"content-Type":"application/json",
        "Accept":"application/json"
      }
    })
  if(response.ok){
    await LoadBooks();
    //valtozok alaphelyzetbe allitasa 
    settitle('');
    setauthor('');
    setpublish_year(0);
    setpage_count(0)
  }}
  catch(error){
     console.error(error)
    }
  }

  async function LoadBooks() {
    const response = await fetch('http://localhost:3000/api/books');
    const data = await response.json();
    setbooks(data.data); // Állítsd be a könyvek állapotát a kapott adatokra
  }

  async function rentBook(bookId: number) {
    try {
      const response = await fetch(`http://localhost:3000/api/books/${bookId}/rent`, {
        method: 'POST',
      });
      if (response.ok) {
        console.log('Sikeres foglalás!');
        await LoadBooks();
      } else {
        const errorData = await response.json();
        console.error('Hiba:', errorData.message);
      }
    } catch (error) {
      console.error('Hiba:', error);
    }
  }

 useEffect(()=>{
  LoadBooks();
  NewBook({} as FormEvent);
  },[])

  return (
    <>
      <header>
  <h1>Petrik Könyvtár Nyilvántartó</h1>
  <nav>
    <a  href='#new-book-section'>Új könyv felvétele</a> | <a href='https://petrik.hu/' target='_blank' rel='noopener noreferrer'>Petrik honlap</a>
  </nav>
</header>

    <main className='container fluid'>
      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3'>
     {
      books.map((b)=><div className='col'>
        <h3>{b.title}</h3>
        <p>kiadás:{b.publish_year}</p>
        <p>oldalszám:{b.page_count}</p>
        <p>szerző:{b.author}</p>
        <img src={'kepek/'+ b.author + '.jpg'} alt={b.author}/>
        <button onClick={() => rentBook(b.id)}>Kölcsönzés</button>
      </div>)
     }</div>
    </main>

     <form id="new-book-section" onSubmit={NewBook}>
      <label>
        cím:<br/>
        <input type='text' onChange={e=>settitle(e.currentTarget.value)} value={title}/>

      </label>
      <label>
        szerző:<br/>
        <input type='text' onChange={e=>setauthor(e.currentTarget.value)} value={author}/>
        
      </label>
      <label>
        kiadás:<br/>
        <input type='number'onChange={e=>setpublish_year(parseInt(e.currentTarget.value))} value={publish_year}/>
        
      </label>
      <label>
        hossz:<br/>
        <input type='number'onChange={e=>setpage_count(parseInt(e.currentTarget.value))} value={page_count}/>
        
      </label>
      <button type='submit' value={"uj könyv"}>beküldés</button>
     </form>
   

<footer>
  Készítette: [A te neved]
</footer>
    </>
  )
}

export default App