import { compile } from 'mdx2';

import { decode, encode } from 'base64';

import { exists, ensureFile } from 'https://deno.land/std@0.147.0/fs/mod.ts';
import * as gfm from 'https://esm.sh/remark-gfm@3.0.1';
// import { add } from './Test/bindings/bindings.ts';
const baseDir = './blog/';

// Open a database

export const buildMdx = async () => {
  const t = Deno.openSync('./dbtest.ts');
  console.log(t);
  console.time('mdx build time ');
  const dirs = ['posts', 'notes'];
  //먼자 한글파일부터 되는지 보자
  await ensureFile(`./mdxIndex.json`);
  let db = JSON.parse(await Deno.readTextFile('./mdxIndex.json'));
  // console.log(db);

  const promises = dirs.map(async (dir) => {
    const path = `./blog/${dir}`;

    const dirObj = {
      [dir]: '',
    };

    for await (const dirEntry of Deno.readDir(path)) {
      const readFileName = `${path}/${dirEntry.name}`;
      const body = await Deno.readTextFile(`${path}/${dirEntry.name}`);
      const fileStat = await Deno.stat(`${path}/${dirEntry.name}`);
      await ensureFile(`./test.json`);
      const encodeFileName = encode(dirEntry.name.split('.')[0]);
      const forWriteFileName = `./routes/blog/${dir}/${encodeFileName}.jsx`;
      const test = {
        title: readFileName,
        atime: fileStat.atime,
        mtime: fileStat.mtime,
        birthtime: fileStat.birthtime,
      };
      // db = { ...db, [dir]: { ...db[dir], [encodeFileName]: test } };
      // console.log('object');
      // console.log(db[encodeFileName] === undefined);
      // console.log(db);
      // console.log(typeof fileStat.mtime, `${path}/${dirEntry.name}`);
      // db.query(`INSERT INTO ${dir} (title,atime) VALUES (?,?)`, [
      //   fileStat.isFile,
      //   fileStat.atime,
      // ]);

      // const compiled = await compile(body, {
      //   jsxImportSource: 'preact',
      //   remarkPlugins: [gfm],
      // });
      // const encodeFileName = encode(dirEntry.name.split('.')[0]);
      // const forWriteFileName = `./routes/blog/${dir}/${encodeFileName}.jsx`;
      // console.log(hashFileName, string);
      // console.log(Deno.statSync(`${path}/${dirEntry.name}`));
      // console.log(dirEntry.name);
      const isFile = await ensureFile(
        `./routes/blog/${dir}/${encodeFileName}.jsx`
      );
      // console.log(`./routes/blog/${dir}/${encodeFileName}.jsx`);

      const existFile = await Deno.readTextFile(forWriteFileName);

      // if (JSON.stringify(existFile) !== JSON.stringify(compiled.value)) {
      //   // const test = await Deno.writeTextFile(
      //   //   `./routes/blog/${dir}/${encodeFileName}.jsx`,
      //   //   compiled
      //   // );
      //   console.log(test);
      // }
    }
  });

  await Promise.all(promises);
  await Deno.writeTextFile(`./mdxIndex.json`, JSON.stringify(db2));
  // console.log(db2.notes);
  console.timeEnd('mdx build time ');
};
