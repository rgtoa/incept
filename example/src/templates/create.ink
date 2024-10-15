<link rel="import" type="template" href="@stackpress/incept/components/theme/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/panel.ink" name="panel-layout" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { env } from '@stackpress/ink';
  import { _ } from '@stackpress/incept/components/i18n';

  const url = '/ink/index.html';
  const title = _('Create Profile');
</script>
<html>
  <html-head />
  <body>
    <panel-layout>
      <header></header>
      <aside left>Add Menu</aside>
      <main>
        <h1>Profile Creation</h1>
        <form action="/profile/create" method="post">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required />
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />
          <button type="submit">Create Profile</button>
        </form>
      </main>
    </panel-layout>
    
  </body>
</html>