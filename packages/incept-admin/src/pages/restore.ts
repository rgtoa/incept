//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//incept
import type { TemplatePlugin } from '@stackpress/incept-ink/dist/types';
import type Model from '@stackpress/incept/dist/schema/Model';
//common
import type { AdminConfig } from '../types';

export default function AdminRestorePageFactory(model: Model) {
  return async function AdminRestorePage(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the server
    const server = req.context;
    //get session
    const session = await server.call('me', req);
    //get the admin config
    const admin = server.config<AdminConfig['admin']>('admin') || {};
    const root = admin.root || '/admin';
    //get the renderer
    const { render } = server.plugin<TemplatePlugin>('template');
    //determine the templates
    const config = server.config.withPath;
    const module = config.get<string>('client.module');
    const error = '@stackpress/incept-admin/dist/components/error';
    const template = `${module}/${model.name}/admin/templates/restore`;
    //get id from url params
    const ids = model.ids.map(column => req.data(column.name)).filter(Boolean);
    if (ids.length === model.ids.length) {
      //if confirmed
      if (req.query('confirmed')) {
        //emit restore event
        const response = await server.call(`${model.dash}-restore`, req);
        //if they want json (success or fail)
        if (req.data.has('json')) {
          return res.setJSON(response);
        }
        //if successfully restored
        if (response.code === 200) {
          //redirect
          return res.redirect(`${root}/${model.dash}/detail/${ids.join('/')}`);
        }
        //not restored, render error page
        return res.setHTML(await render(error, { 
          ...response, 
          settings: admin,
          session: session.results 
        }));
      }
      const response = await server.call('${model.dash}-detail', req);
      //if they want json (success or fail)
      if (req.data.has('json')) {
        return res.setJSON(response);
      }
      //if successfully fetched
      if (response.code === 200) {
        //render the restore page
        return res.setHTML(await render(template, { 
          ...response, 
          settings: admin, 
          session: session.results 
        }));
      }
      //it did not fetch, render error page
      return res.setHTML(await render(error, { 
        ...response, 
        settings: admin,
        session: session.results
      }));
    }
    //if they want json (success or fail)
    if (req.data.has('json')) {
      return res.setJSON({ code: 404, status: 'Not Found' });
    }
    //no id was found, render error page (404)
    res.setHTML(await render(error, { 
      code: 404, 
      status: 'Not Found',
      settings: admin,
      session: session.results 
    }));
  };
};