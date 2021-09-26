<footer>
  <img src="/icons/icon-512x512.png" alt="wishlist logo" />
  <div class="content">
    <p>
      Find this project on
      <a href="https://github.com/Zareix/raphael-wishlist"> Github</a><br />
      Made by
      <a href="https://www.raphael-catarino.fr/"><em>Raphaël Catarino</em></a>
    </p>
  </div>
</footer>

<style>
  footer {
    height: 175px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-end;
    justify-items: center;
    justify-content: center;
    padding-bottom: 6rem;
    color: #4b5563;
    background-color: #f3f4f6;
  }

  img {
    width: 50px;
    height: 50px;
    margin-bottom: 0.75em;
  }

  a {
    color: var(--gray);
    text-decoration: underline;
  }

  p {
    margin: 0 auto;
    width: 70%;
    line-height: 1.5em;
    text-align: center;
  }

  .content {
    width: 100%;
  }

  @media (prefers-color-scheme: dark) {
    footer {
      background-color: #1f2937;
      color: white;
    }

    a {
      color: var(--gray-light);
    }
  }
</style>
