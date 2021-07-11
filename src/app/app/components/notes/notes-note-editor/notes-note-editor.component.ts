import { NoteModel } from './../../../models/note.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RouterUrls } from 'src/app/libraries/util/models/router.model';
import { GlobalVariablesService } from 'src/app/libraries/util/services/global-variables.service';
import { RouterService } from 'src/app/libraries/util/services/router.service';
import { LoadService } from 'src/app/libraries/loading/services/load.service';
import { DatabaseService } from 'src/app/libraries/util/services/database.service';
import { AuthService } from 'src/app/libraries/authentication/services/auth.service';
import { QuillEditorComponent } from 'ngx-quill';
import 'quill-emoji/dist/quill-emoji.js';

@Component({
  selector: 'notes-note-editor',
  templateUrl: './notes-note-editor.component.html',
  styleUrls: ['./notes-note-editor.component.scss'],
})
export class NotesNoteEditorComponent implements OnInit {
  URLs = RouterUrls;

  @Input() mode: 'add' | 'edit';
  note: NoteModel = {} as NoteModel;

  @ViewChild('quill') quill: QuillEditorComponent;
  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

    ['clean'], // remove formatting button

    ['emoji'],

    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],
  ];

  constructor(
    public gv: GlobalVariablesService,
    private router: RouterService,
    public loader: LoadService,
    private db: DatabaseService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}

  cancel() {
    this.router.nav_backward();
  }
  async add() {
    this.loader.load();

    const title = new DOMParser()
      .parseFromString(this.note.body, 'text/html')
      .getElementsByTagName('body')[0].children[0];
    this.note.title = title.innerHTML;
    this.note.body = this.note.body.replace(title.outerHTML, '');

    await this.db.addNote(this.auth.userData.uid, this.note);

    this.loader.unload();

    this.router.nav(this.URLs.notes_note, [this.note.id]);
  }
}
